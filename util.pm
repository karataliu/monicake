package util;

use 5.010;
use strict;
use warnings;
use Exporter qw(import);

our @EXPORT_OK      = qw(installFile runCmd
    LOGDEBUG LOGINFO LOGWARN LOGERR info
    );
our %EXPORT_TAGS    = (logging => [qw(LOGDEBUG LOGINFO LOGWARN LOGERR info)]);

use constant {
    LOGDEBUG  => 1,
    LOGINFO   => 2,
    LOGWARN   => 3,
    LOGERR    => 4,
};

our $verbose = LOGINFO;
our $dryrun  = 1;

sub installFile
{
    my $path        = shift;
    my $content     = shift;
    my $FL;

    return 0 if $dryrun;

    open($FL, '>', $path);
    print $FL $content;
    close $FL;
    return 0;
}

sub setLogLevel
{
    $verbose = shift;
}

sub info
{
    my $msg     = shift;
    my $level   = shift || LOGINFO;

    return if ($verbose > $level);
    say "[MONICAKE] $msg";
}

sub runCmd
{
    my $cmd = shift;
    if ($verbose >= LOGINFO) { $cmd .= " >/dev/null"; }

    info "Run command:\n$cmd", LOGDEBUG;
    return 0 if $dryrun;

    my $ret = system($cmd);
    if ($ret){
        info "Return code is $ret", LOGDEBUG;
    }

    return $ret;
}

1;
