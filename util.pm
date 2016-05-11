package util;

use 5.010;
use strict;
use warnings;
use Exporter qw(import);

our @EXPORT_OK      = qw(installFile
    LOGDEBUG LOGINFO LOGWARN LOGERR setLogLevel info);
our %EXPORT_TAGS    = (logging => [qw(LOGDEBUG LOGINFO LOGWARN LOGERR setLogLevel info)]);

use constant {
    LOGDEBUG  => 1,
    LOGINFO   => 2,
    LOGWARN   => 3,
    LOGERR    => 4,
};

sub installFile
{
    my $path        = shift;
    my $content     = shift;
    my $FL;

    open($FL, '>', $path);
    print $FL $content;
    close $FL;
    return 0;
}

my $verbose = LOGINFO;

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

1;
